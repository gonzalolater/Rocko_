function CircleProgressBar({
  circleWidth,
  percentage,
  radius,
  strokeWidth,
}: {
  circleWidth: number;
  percentage: number;
  radius: number;
  strokeWidth: number;
}) {
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  return (
    <div>
      <svg
        width={circleWidth}
        height={circleWidth}
        viewBox={`0 0 ${circleWidth}  ${circleWidth}`}
      >
        <circle
          strokeWidth={`${strokeWidth}px`}
          r={radius}
          className="fill-none stroke-[#CBCBCB]"
          cx={circleWidth / 2}
          cy={circleWidth / 2}
        />
        <circle
          strokeWidth={`${strokeWidth}px`}
          r={radius}
          className="fill-none stroke-[#276EF1]"
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
        />
      </svg>
    </div>
  );
}

export default CircleProgressBar;
