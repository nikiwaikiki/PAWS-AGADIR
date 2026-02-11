import * as React from "react";

import DogMap from "@/components/DogMap";

class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep the app alive even if the map crashes
    console.error("Map render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            Map temporarily unavailable
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The interactive map failed to load in this environment. You can still browse the dogs list
            while we work on compatibility.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

type DogMapProps = React.ComponentProps<typeof DogMap>;

export default function SafeDogMap(props: DogMapProps) {
  return (
    <MapErrorBoundary>
      <DogMap {...props} />
    </MapErrorBoundary>
  );
}
