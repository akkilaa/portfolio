const Logo = () => {
  return (
    <a
      href="#top"
      className="flex items-center gap-2.5 font-mono text-[15px] font-semibold tracking-tight text-white no-underline"
    >
      <span
        className="size-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)] animate-[pulse_2.4s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <span>akkila</span>
      <span className="font-normal text-[var(--text-dim)]">.dev</span>
    </a>
  )
}

export default Logo
