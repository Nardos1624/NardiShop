function PoweredBy() {
  return (
    <div className="w-full flex items-center justify-center gap-2 bg-white px-4 py-3 text-sm text-black">
      <span>powered by</span>
      <a
        href="https://techthinkerss.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-medium text-black no-underline transition-colors hover:text-[#041C24] hover:underline"
      >
        <img src="/placeholder/TTlogo.png" alt="Techthinker logo" className="h-5 w-5" />
        Techthinker
      </a>
    </div>
  );
};

export default PoweredBy;
