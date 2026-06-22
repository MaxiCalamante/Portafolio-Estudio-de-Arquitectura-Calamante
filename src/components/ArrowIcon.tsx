type ArrowIconProps = {
  direction?: 'right' | 'down'
}

export function ArrowIcon({ direction = 'right' }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow-icon arrow-icon--${direction}`}
      viewBox="0 0 42 18"
      fill="none"
    >
      <path d="M1 9h38M32 2l7 7-7 7" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}
