export default function AlertMessage({ type = "error", message }) {
  if (!message) {
    return null;
  }

  const styleByType = {
    error: "border-err/20 bg-err/10 text-err",
    success: "border-ok/20 bg-ok/10 text-ok"
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
        styleByType[type] ?? styleByType.error
      }`}
    >
      {message}
    </div>
  );
}
