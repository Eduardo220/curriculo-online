import { Component } from "react";

function resetKeysChanged(previousKeys = [], nextKeys = []) {
  return (
    previousKeys.length !== nextKeys.length ||
    previousKeys.some((key, index) => !Object.is(key, nextKeys[index]))
  );
}

export class SceneErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.error &&
      resetKeysChanged(previousProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { children, fallback } = this.props;
    const { error } = this.state;

    if (!error) return children;

    if (typeof fallback === "function") {
      return fallback({ error, reset: this.reset });
    }
    if (fallback !== undefined) return fallback;

    return (
      <div role="status" aria-live="polite" data-scene-fallback="">
        <p>Visualização 3D indisponível neste dispositivo.</p>
        <button type="button" onClick={this.reset}>
          Tentar novamente
        </button>
      </div>
    );
  }
}

export default SceneErrorBoundary;
