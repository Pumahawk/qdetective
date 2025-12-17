import { useRef } from "react";

export interface ServerSetupProps {
  onServerSelected?: (address: string) => void;
}

export function ServerSetupComponent({ onServerSelected }: ServerSetupProps) {
  const inputElementRef = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onServerSelected && onServerSelected(inputElementRef.current!.value);
      }}
    >
      <div>
        <input
          ref={inputElementRef}
          name="server-name"
          type="text"
          placeholder="Server Address"
          required
        />
      </div>
    </form>
  );
}
