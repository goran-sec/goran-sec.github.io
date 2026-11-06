export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter uppercase">
        <span dir="ltr">404</span>{" "}
        <span
          dir="ltr"
          className="font-normal text-gruvbox-lime text-sm md:text-2xl"
        >
          (page not found)
        </span>
      </h1>
      <p dir="ltr" className="mb-4 text-sm text-right">
        The page you are looking for does not exist.
      </p>
      <p dir="rtl" className="mb-4 text-sm text-right">
        ئەو پەڕەیەی دەتەوێت بیدۆزیتەوە بوونی نییە.
      </p>
    </section>
  );
}
