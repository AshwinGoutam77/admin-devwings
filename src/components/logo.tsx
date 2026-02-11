export function Logo() {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <img
        src={"https://devwings.vercel.app/images/logo-devwings.webp"}
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
      />

      <img
        src={"https://devwings.vercel.app/images/logo-devwings.webp"}
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
      />
    </div>
  );
}
