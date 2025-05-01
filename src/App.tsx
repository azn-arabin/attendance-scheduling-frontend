import "./App.css";
import { Button } from "@/components/ui/button.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <ModeToggle />
      <Button variant="default">Click me</Button>
    </div>
  );
}

export default App;
