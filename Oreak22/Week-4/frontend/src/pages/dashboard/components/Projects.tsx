import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Projects = ({ totalProject }: { totalProject: number }) => {
  const navigate = useNavigate();
  return (
    <Card className="w-full aspect-video rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-all flex flex-col justify-center items-center p-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          Project Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A quick look at your current activity
        </p>
      </CardHeader>

      <Separator className="w-1/2 mx-auto my-3" />

      <CardContent className="w-full flex items-center justify-evenly mt-4">
        {/* Total Projects */}
        <div className="relative flex flex-col items-center justify-center text-center rounded-full w-32 h-32 bg-muted hover:bg-accent transition-all shadow-sm">
          <h1 className="text-3xl font-bold text-primary">{totalProject}</h1>
          <h3 className="text-sm text-muted-foreground mt-1">Total Projects</h3>
          <Button
            onClick={() => navigate("/new-project")}
            variant="ghost"
            size="sm"
            className="text-xs mt-2 text-primary flex items-center gap-1 hover:text-primary/80"
          >
            New Project <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
