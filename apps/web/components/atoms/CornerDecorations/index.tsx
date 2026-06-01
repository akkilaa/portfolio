const base = 'absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50'

const CornerDecorations = () => (
  <>
    <span className={`${base} top-[-1px] left-[-1px] border-r-0 border-b-0`} />
    <span className={`${base} top-[-1px] right-[-1px] border-l-0 border-b-0`} />
    <span className={`${base} bottom-[-1px] left-[-1px] border-r-0 border-t-0`} />
    <span className={`${base} bottom-[-1px] right-[-1px] border-l-0 border-t-0`} />
  </>
)

export default CornerDecorations
