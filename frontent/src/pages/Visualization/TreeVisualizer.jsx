import { useEffect, useState, useRef } from "react";

/**
 * Recursively calculate positions (returns number of "columns" used by this subtree)
 */
const assignPositions = (node, depth = 0, x = 0, positions = [], parent = null) => {
  if (!node) return 0;

  const leftWidth = assignPositions(node.left, depth + 1, x, positions, node);
  const currentX = x + leftWidth;
  positions.push({ node, x: currentX, y: depth, parent });
  const rightWidth = assignPositions(node.right, depth + 1, currentX + 1, positions, node);

  return leftWidth + 1 + rightWidth;
};

const TreeVisualizer = ({ tree, highlight, algorithm }) => {
  if (!tree || !tree.root) return <p className="text-white text-center">Tree is empty</p>;

  // responsive detection (updates on resize)
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 640 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // compute positions
  const positionsRef = useRef([]);
  positionsRef.current = []; // reset each render
  assignPositions(tree.root, 0, 0, positionsRef.current);
  const positions = positionsRef.current;

  // fallback if nothing (safety)
  if (!positions || positions.length === 0) {
    return <p className="text-white text-center">Tree has no nodes</p>;
  }

  // responsive sizing (smaller on mobile)
  const nodeRadius = isMobile ? 12 : 18;
  const horizontalSpacing = isMobile ? 55 : 80;
  const verticalSpacing = isMobile ? 60 : 70;

  // dynamic canvas size (px)
  const width = Math.max(positions.length * horizontalSpacing + 200, 300);
  const height = (Math.max(...positions.map((p) => p.y), 0) + 1) * verticalSpacing + 150;

  return (
    <div className="w-full h-[80vh] bg-gray-950 rounded-lg p-2">
      {/* scroll container: allows both horizontal & vertical scroll on mobile & desktop
          styles enable smooth touch scrolling on iOS/Android */}
      <div
        className="w-full h-full"
        style={{
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x pan-y",
        }}
      >
        {/* inner wrapper:
            - width: 100% so when svg is smaller than viewport, wrapper fills viewport
            - minWidth: width px so when svg is larger than viewport, wrapper grows and outer container scrolls
            - flex + justify-center centers the svg when it fits
        */}
        <div
          style={{
            width: "100%",
            minWidth: `${width}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <svg
            role="img"
            aria-label="Tree visualization"
            width={width}
            height={height}
            style={{ display: "block" }}
          >
            {/* Lines */}
            {positions.map((p, idx) => {
              const { node, parent, x, y } = p;
              if (!parent) return null;
              const parentPos = positions.find((pp) => pp.node === parent);
              if (!parentPos) return null;
              return (
                <line
                  key={`line-${idx}`}
                  x1={parentPos.x * horizontalSpacing + nodeRadius}
                  y1={parentPos.y * verticalSpacing + nodeRadius}
                  x2={x * horizontalSpacing + nodeRadius}
                  y2={y * verticalSpacing + nodeRadius}
                  stroke="white"
                  strokeWidth="1.6"
                />
              );
            })}

            {/* Nodes */}
            {positions.map((p, idx) => {
              const { node, x, y } = p;
              const isHighlight = highlight && highlight.value === node.value;

              let fillColor = "blue";
              let textColor = "white";
              if (algorithm === "RB") fillColor = node.color === "red" ? "red" : "black";

              const strokeColor = isHighlight ? "yellow" : "white";
              const strokeWidth = isHighlight ? 3 : 1.8;

              return (
                <g key={`node-${idx}`} style={{ cursor: "default" }}>
                  <circle
                    cx={x * horizontalSpacing + nodeRadius}
                    cy={y * verticalSpacing + nodeRadius}
                    r={nodeRadius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                  <text
                    x={x * horizontalSpacing + nodeRadius}
                    y={y * verticalSpacing + nodeRadius + (isMobile ? 4 : 5)}
                    fontSize={isMobile ? 10 : 12}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={textColor}
                    pointerEvents="none"
                  >
                    {node.value}
                    {node.count > 1 ? `(${node.count})` : ""}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;
