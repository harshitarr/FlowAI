"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Check, PhoneCall, Mic, Settings, CalendarCheck } from "lucide-react"; // Icons for the timeline

// --- Timeline Component ---
// Renders the progress through the fitness program generation stages
const Timeline = ({ currentStage }) => {
  // Adjusted stages to reflect the call flow: Start -> Collect -> Ready
  const stages = [
    { id: 1, name: "Start Call", icon: PhoneCall, key: "start_call" },
    { id: 2, name: "Collecting Details", icon: Mic, key: "collecting_details" },
    // Temporarily keeping ID 3 for internal stage counting consistency, but using a simpler name
    { id: 3, name: "Finalizing", icon: Settings, key: "processing" }, 
    { id: 4, name: "Program Ready", icon: CalendarCheck, key: "program_ready" },
  ];

  const getStageStatus = (stageKey) => {
    switch (stageKey) {
      case "start_call":
        return currentStage >= 1;
      case "collecting_details":
        return currentStage >= 2;
      case "processing":
        // Stage 3 is active briefly before final step (or can be treated as complete only when 4 is active)
        return currentStage >= 3; 
      case "program_ready":
        return currentStage >= 4;
      default:
        return false;
    }
  };

  return (
    <div className="flex justify-between items-start text-center my-10 relative">
      {/* Horizontal Line */}
      <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200">
        <div
          className="h-1 bg-primary transition-all duration-500"
          style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
        />
      </div>

      {stages.map((stage, index) => {
        const isActive = getStageStatus(stage.key);
        const isComplete = currentStage > stage.id;
        const Icon = stage.icon;

        return (
          <div key={stage.id} className="relative z-10 flex flex-col items-center w-1/4 px-2">
            {/* Stage Icon/Indicator */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 
                ${isComplete ? "bg-primary border-primary" : isActive ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" : "bg-white border-gray-300 text-gray-400"}
              `}
            >
              {isComplete ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              )}
            </div>
            
            {/* Stage Label */}
            <p
              className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {stage.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};


// --- Main Component ---
const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user, isLoaded } = useUser();
  const router = useRouter();

  // ✅ Hook to create Vapi session
  const createVapiSession = useMutation(api.sessions.createVapiSession);

  const messageContainerRef = useRef(null);

  // --- LOGIC: Determine Current Stage for Timeline (Adjusted) ---
  let currentStage = 1; // Default: Start Call
  if (callActive || connecting) {
    currentStage = 2; // Call is active or connecting (Collecting Details)
    // Note: Stage 3 (Processing/Finalizing) is implicitly the short period between call end and redirect.
    // We only visually advance it to 4 when callEnded is true.
  }
  if (callEnded) {
    currentStage = 4; // Program Ready
  }

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true); // Triggers the final stage
    };

    const handleSpeechStart = () => {
      console.log("AI started Speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    };

    const handleMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        // Ensure user is loaded before starting call
        if (!user?.id) {
          console.error("User not loaded or authenticated");
          setConnecting(false);
          return;
        }

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "There";

        console.log("Creating Vapi session for user:", user.id);
        console.log("Full name:", fullName);

        // ✅ CREATE USER SESSION: Store current user for Vapi calls
        try {
          await createVapiSession({
            clerkId: user.id,
            timestamp: Date.now()
          });
          
          console.log("Vapi session created successfully for:", user.id);
        } catch (sessionError) {
          console.error("Error creating Vapi session:", sessionError);
          setConnecting(false);
          return;
        }

        // ✅ Start Vapi call - no user ID passed, backend gets it from session
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
          variableValues: {
            full_name: fullName,
            // ✅ No user ID - backend will get it dynamically from session
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen text-foreground bg-white overflow-hidden pb-6 pt-24">
        <div className="container mx-auto px-4 h-full max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground font-semibold">Loading user data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen text-foreground bg-white overflow-hidden pb-6 pt-24">
        <div className="container mx-auto px-4 h-full max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <span className="text-lg text-muted-foreground font-semibold">Please sign in to use the fitness assistant</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-white pb-12 pt-7">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Generate Your <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-md text-muted-foreground mt-2">
            Use the voice assistant to create your **personalized plan**
          </p>
        </div>

        {/* --- TIMELINE COMPONENT --- */}
        <Timeline currentStage={currentStage} />
        {/* --------------------------- */}

        {/* VOICE INTERFACE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* AI ASSISTANT CARD (Lighter & Professional) */}
          <Card className={`bg-white shadow-xl border-t-4 transition-all duration-300 ${callActive ? 'border-primary shadow-lg' : 'border-gray-200'}`}>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              
              {/* AI IMAGE with Active Ring */}
              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${isSpeaking ? 'ring-4 ring-primary ring-offset-4 ring-offset-white' : 'ring-0'}`}
                />
                <div className="relative w-full h-full rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden">
                  <img
                    src="/ai-avatar.png"
                    alt="AI Assistant"
                    className="w-full h-full object-cover rounded-full"
                  />
                  {/* Voice Wave Animation */}
                  <div 
                    className={`absolute inset-0 flex justify-center items-center transition-opacity duration-300 ${isSpeaking ? 'opacity-50' : 'opacity-0'}`}
                  >
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-end h-16">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`mx-1 h-12 w-1 bg-primary rounded-full transition-all duration-100 ease-out`}
                          style={{
                            animationDelay: `${i * 0.15}s`,
                            height: isSpeaking ? `${Math.random() * 80 + 20}%` : "5px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900">Flow.AI</h2>
              <p className="text-sm text-primary mt-1 font-medium">Fitness & Diet Coach</p>

              {/* SPEAKING INDICATOR */}
              <div
                className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-300 
                  ${isSpeaking ? "bg-primary/10 border-primary text-primary" : 
                    callActive ? "bg-green-50 border-green-200 text-green-700" :
                    callEnded ? "bg-blue-50 border-blue-200 text-blue-700" :
                    "bg-gray-50 border-gray-200 text-gray-600"
                  }
                `}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : callActive ? "bg-green-500" : callEnded ? "bg-blue-500" : "bg-gray-400"}`}
                />
                <span className="text-xs font-semibold">
                  {isSpeaking
                    ? "Flow.AI Speaking..."
                    : callActive
                      ? "Listening..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Ready to Start"}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD (Lighter & Professional) */}
          <Card className={`bg-white shadow-xl border-t-4 transition-all duration-300 ${callActive ? 'border-secondary shadow-lg' : 'border-gray-200'}`}>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                <div className="relative w-full h-full rounded-full border-4 border-gray-200 overflow-hidden">
                    <img
                      src={user?.imageUrl}
                      alt="User"
                      className="size-full object-cover rounded-full"
                    />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user ? (user.firstName + " " + (user.lastName || "")).trim() : "Guest"}
              </p>

              {/* User Ready Text */}
              <div className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700`}>
                <div className={`w-2 h-2 rounded-full bg-green-500`} />
                <span className="text-xs font-semibold">
                  {user?.id ? "Authenticated" : "Loading..."}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE CONTAINER  (Lighter and WhatsApp style) */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10 h-64 overflow-y-auto shadow-inner transition-all duration-300 scroll-smooth"
            style={{ maxHeight: '300px' }}
          >
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                    key={index} 
                    className={`p-3 rounded-xl animate-fadeIn shadow-sm max-w-[85%] w-fit 
                        ${msg.role === "assistant" 
                            ? "bg-primary/5 text-gray-800 border-l-4 border-primary mr-auto" // AI: Left aligned
                            : "bg-gray-100 text-gray-800 border-r-4 border-gray-300 ml-auto" // User: Right aligned
                        }`
                    }
                >
                  <div className={`font-bold text-xs mb-1 ${msg.role === "assistant" ? "text-primary" : "text-gray-500"}`}>
                    {msg.role === "assistant" ? "Flow.AI" : "You"}
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}

              {callEnded && (
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 animate-fadeIn">
                  <div className="font-bold text-xs text-blue-600 mb-1">System Message:</div>
                  <p className="text-sm">
                    Your fitness program has been created! Redirecting to your profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-60 h-12 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-[1.03] shadow-lg ${
              callActive
                ? "bg-destructive hover:bg-destructive/90 shadow-destructive/40"
                : connecting
                  ? "bg-primary/50 text-white"
                  : callEnded
                    ? "bg-green-600 hover:bg-green-700 shadow-green-500/40"
                    : "bg-primary hover:bg-primary/90 shadow-primary/40"
            } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded || !user?.id}
          >
            {/* Ping animation for connecting state */}
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary opacity-75"></span>
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
              {callActive
                ? <><PhoneCall className="w-5 h-5" /> END CALL</>
                : connecting
                  ? "CONNECTING..."
                  : callEnded
                    ? <><CalendarCheck className="w-5 h-5" /> VIEW PROGRAM</>
                    : !user?.id
                      ? "LOADING USER..."
                      : <><PhoneCall className="w-5 h-5" /> START CALL</>}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateProgramPage;