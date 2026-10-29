/**
 * Thin bar fixed to the top of every page. The message glides from the left
 * edge to the right edge and back. The navbar sits just below it (top-9).
 */
export default function AnnouncementBar() {
  return (
    <>
      <div
        role="note"
        className="fixed inset-x-0 top-0 z-50 flex h-9 items-center overflow-hidden bg-[#281E18] px-4 text-xs font-medium text-white sm:text-sm"
      >
        <div className="announcement-track w-full whitespace-nowrap">
          <span className="announcement-text inline-block">
            Order online — <span className="text-[#D4AF37]">pay 50% now, the rest on delivery</span>
          </span>
        </div>
      </div>
      {/* Keeps page content from sliding under the fixed bar */}
      <div aria-hidden="true" className="h-9" />
    </>
  );
}
