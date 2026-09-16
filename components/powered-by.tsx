function PoweredBy() {
  return (
    <div
      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm"
      style={{ backgroundColor: "#ffffff", color: "#000000" }}
    >
      <span
        style={{ color: "#000000", backgroundColor: "transparent",cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#005565")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
      >
        powered by
      </span>
      <a
        href="https://techthinkerss.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-medium no-underline transition-colors hover:underline"
        style={{ color: "#000000", textDecorationColor: "#005565", backgroundColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#005565")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
      >
        <img src="/placeholder/TTlogo.png" alt="Techthinker logo" className="h-8 w-8" style={{ backgroundColor: "transparent" }} />
        Techthinker
      </a>
    </div>
  );
};

export default PoweredBy;
