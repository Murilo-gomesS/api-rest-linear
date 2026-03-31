interface FeedbackProps {
  type: "success" | "error" | "info";
  message: string;
}

export function Feedback({ type, message }: FeedbackProps) {
  return <p className={`feedback ${type}`}>{message}</p>;
}