import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Play, Sparkles, Loader2, Settings, Info, Github } from "lucide-react";
import { PROJECT_NAME, PROJECT_TAGLINE } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import CityVisualization from "@/components/CityVisualization";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const ACCESS_CODE = "COGNITECT2024"; // Access code for manual mode

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isAutoMode, setIsAutoMode] = useState(true); // Default to Auto Mode
  const [currentProjectId, setCurrentProjectId] = useState<number | undefined>();
  const [showAccessCodeDialog, setShowAccessCodeDialog] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  // Fetch project data
  const { data: project } = trpc.city.getProject.useQuery(
    { projectId: currentProjectId! },
    { enabled: !!currentProjectId, refetchInterval: 2000 }
  );

  // Fetch buildings
  const { data: buildings } = trpc.city.getBuildings.useQuery(
    { projectId: currentProjectId! },
    { enabled: !!currentProjectId, refetchInterval: 2000 }
  );

  // Fetch logs (Claude's thoughts)
  const { data: logs } = trpc.city.getLogs.useQuery(
    { projectId: currentProjectId! },
    { enabled: !!currentProjectId, refetchInterval: 2000 }
  );

  const createProject = trpc.city.create.useMutation({
    onSuccess: (data) => {
      console.log('[Frontend] Project created:', data);
      setCurrentProjectId(data.projectId);
      toast.success("Claude is starting to build your city!");
      startBuilding.mutate({ projectId: data.projectId });
    },
    onError: (error) => {
      console.error('[Frontend] Create project error:', error);
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const startBuilding = trpc.city.startBuilding.useMutation({
    onSuccess: () => {
      console.log('[Frontend] Building process started');
      toast.success("Claude is now building!");
    },
    onError: (error) => {
      console.error('[Frontend] Start building error:', error);
      toast.error(`Failed to start building: ${error.message}`);
    },
  });

  const handleAccessCodeSubmit = () => {
    if (accessCode === ACCESS_CODE) {
      setShowAccessCodeDialog(false);
      setAccessCode("");
      proceedWithBuilding();
    } else {
      toast.error("Invalid access code");
    }
  };

  const proceedWithBuilding = () => {
    const finalPrompt = isAutoMode 
      ? `Create an innovative AI-powered virtual city with creative urban design`
      : prompt.trim();

    if (!finalPrompt) {
      toast.error("Please enter a prompt or enable Auto Mode");
      return;
    }

    createProject.mutate({
      name: isAutoMode ? "Claude Autonomous City" : "Custom City Project",
      prompt: finalPrompt,
    });
  };

  const handleStartBuilding = () => {
    if (!isAutoMode) {
      setShowAccessCodeDialog(true);
      return;
    }
    proceedWithBuilding();
  };

  const isLoading = createProject.isPending || startBuilding.isPending;

  // Calculate building progress
  const totalBuildings = 50;
  const currentBuildings = buildings?.length || 0;
  const progress = Math.min((currentBuildings / totalBuildings) * 100, 100);

  // Building phases
  const phases = [
    { name: "Infrastructure", range: [0, 10], icon: "🏗️" },
    { name: "Commercial", range: [10, 22], icon: "🏪" },
    { name: "Residential", range: [22, 34], icon: "🏘️" },
    { name: "Office", range: [34, 44], icon: "🏢" },
    { name: "Public Facilities", range: [44, 50], icon: "🏛️" },
  ];

  const currentPhase = phases.find(
    (p) => currentBuildings >= p.range[0] && currentBuildings < p.range[1]
  ) || phases[phases.length - 1];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Access Code Dialog */}
      <Dialog open={showAccessCodeDialog} onOpenChange={setShowAccessCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Code Required</DialogTitle>
            <DialogDescription>
              Manual mode requires an access code. Please enter the code to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAccessCodeSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAccessCodeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccessCodeSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Claude Logo */}
            <img 
              src="/claude-logo.png" 
              alt="Claude Logo" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-2xl font-bold claude-orange-color">{PROJECT_NAME}</h1>
              <p className="text-sm text-muted-foreground">{PROJECT_TAGLINE}</p>
            </div>
          </div>
          {/* Social Media and Action Icons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-primary/10"
              onClick={() => window.open('https://github.com/Weezythegods69/claude-blueprint', '_blank')}
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-primary/10"
              onClick={() => window.open('https://x.com/claudeblueprint', '_blank')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Control Panel */}
        {!currentProjectId && (
          <Card className="claude-card p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Watch Claude Build Your Dream City</h2>
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-mode"
                    checked={isAutoMode}
                    onCheckedChange={setIsAutoMode}
                  />
                  <Label htmlFor="auto-mode" className="flex items-center gap-1 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    Auto Mode
                  </Label>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {isAutoMode
                  ? "Claude will autonomously design and build a complete virtual city"
                  : "Give Claude specific instructions for your custom city design"}
              </p>

              {!isAutoMode && (
                <Textarea
                  placeholder="Example: Create a modern eco-friendly city with parks, solar panels, and green buildings"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                />
              )}

              <Button
                onClick={handleStartBuilding}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Claude is thinking...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Building
                  </>
                )}
              </Button>

              {!isAutoMode && (
                <p className="text-xs text-muted-foreground text-center">
                  Manual mode requires an access code
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Active Project View */}
        {currentProjectId && (
          <div className="space-y-6">
            {/* City Canvas */}
            <div className="h-[600px] rounded-lg overflow-hidden border-2 border-primary/20 claude-card">
              <CityVisualization projectId={currentProjectId} />
            </div>

            {/* Building Progress & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Building Phases */}
              <Card className="claude-card p-6">
                <h3 className="text-lg font-semibold mb-4 claude-orange-color">Building Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="claude-orange-color font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    {phases.map((phase) => {
                      const isActive = phase.name === currentPhase.name;
                      const isCompleted = currentBuildings >= phase.range[1];
                      return (
                        <div
                          key={phase.name}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                            isActive ? 'bg-primary/10 border border-primary/30' : ''
                          }`}
                        >
                          <span className="text-xl">{phase.icon}</span>
                          <span className={`flex-1 ${isActive ? 'font-semibold claude-orange-color' : ''}`}>
                            {phase.name}
                          </span>
                          {isCompleted && <span className="text-green-500">✓</span>}
                          {isActive && <Loader2 className="h-4 w-4 animate-spin claude-orange-color" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* City Stats */}
              <Card className="claude-card p-6">
                <h3 className="text-lg font-semibold mb-4 claude-orange-color">City Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">🏢 Buildings</span>
                    <span className="text-2xl font-bold">{currentBuildings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">🏗️ Infrastructure</span>
                    <span className="text-2xl font-bold">
                      {buildings?.filter(b => b.type === 'park' || b.type === 'road').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">🏪 Commercial</span>
                    <span className="text-2xl font-bold">
                      {buildings?.filter(b => b.type === 'commercial').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">🏘️ Residential</span>
                    <span className="text-2xl font-bold">
                      {buildings?.filter(b => b.type === 'residential').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">⚡ Current Phase</span>
                    <span className="text-lg font-semibold claude-orange-color">{currentPhase.name}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Claude's Thoughts & Blueprint */}
            <Card className="claude-card p-6">
              <Tabs defaultValue="thoughts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="thoughts">Claude's Thoughts</TabsTrigger>
                  <TabsTrigger value="blueprint">Building Blueprint</TabsTrigger>
                </TabsList>
                <TabsContent value="thoughts" className="mt-4">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto terminal-text">
                    {logs && logs.length > 0 ? (
                      logs.map((log, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/40">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-xs claude-orange-color font-semibold">Claude</span>
                          </div>
                          <p className="text-sm">{log.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Claude is thinking...
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="blueprint" className="mt-4">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto terminal-text">
                    {buildings && buildings.length > 0 ? (
                      buildings.map((building, idx) => (
                        <div key={idx} className="p-2 rounded bg-background/50 border border-border/40 text-xs">
                          <span className="claude-orange-color font-semibold">{building.name}</span>
                          <span className="text-muted-foreground ml-2">
                            [{building.type}] {building.width}x{building.depth}x{building.height}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No buildings yet
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="claude-orange-color font-semibold">Claude AI</span> from Anthropic
          </p>
        </div>
      </footer>
    </div>
  );
}
