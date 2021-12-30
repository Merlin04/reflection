import React from "react";
import { Rnd } from "react-rnd";
import { css } from "@emotion/css";

function WindowButton({
    color,
    onClick,
}: {
    color: string;
    onClick: () => void;
}) {
    return (
        <button
            className={css`
                border-width: 0px;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: ${color};
                cursor: pointer;
            `}
            onClick={onClick}
        />
    );
}

const TITLE_BAR_HEIGHT = 24;

function getRndSize() {
    return Object.fromEntries(
        ["width", "height"]
            .map((k) => [
                k,
                Number(
                    document
                        .getElementsByClassName("react-draggable")[0]
                        //@ts-ignore
                        .style[k].slice(0, -2)
                ),
            ])
    ) as { width: number; height: number };
};

export default function Window({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    const [minimized, setMinimized] = React.useState<false | number>(false);
    const [maximized, setMaximized] = React.useState<false | {
        size: { width: number; height: number },
        position: { x: number; y: number }
    }>(false);
    const [transparent, setTransparent] = React.useState(false);
    const rndRef = React.useRef<Rnd>(null);

    return (
        <Rnd
            ref={rndRef}
            default={{
                x: 50,
                y: 50,
                width: 800,
                height: 600,
            }}
            minWidth={500}
            minHeight={minimized ? TITLE_BAR_HEIGHT : 200}
            maxHeight={minimized ? TITLE_BAR_HEIGHT : undefined}
            cancel="[data-rnd-cancel]"
            className={css`
        z-index: 1;
      `}
            onResizeStart={() => setTransparent(true)}
            onResizeStop={() => {
                setTransparent(false);
                globalThis.monacoEditor?.layout();
            }}
            onDragStart={() => setTransparent(true)}
            onDragStop={() => setTransparent(false)}
            disableDragging={Boolean(maximized)}
        >
            <div
                className={css`
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    opacity: ${transparent ? "0.7" : "inherit"};
                    transition: opacity 0.1s ease-in-out;
                `}
            >
                {/* Window controls */}
                <div
                    className={css`
                        background-color: lightgray;
                        display: flex;
                        align-items: center;
                        padding: 0 0.5rem;
                        gap: 0.5rem;
                        height: ${TITLE_BAR_HEIGHT}px;
                    `}
                >
                    <span
                        className={css`
                            text-align: center;
                            flex: 1;
                            font-size: 1rem;
                            /* thanks codesandbox (I think it's auto added by sass, not sure) */
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                                Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
                                "Helvetica Neue", Helvetica, Arial, sans-serif;
                            line-height: 1.5rem;
                        `}
                    >
                        Reflection editor
                    </span>

                    <WindowButton
                        color="#ffdf00"
                        onClick={() => {
                            if (minimized) {
                                rndRef.current!.updateSize({
                                    width: getRndSize().width,
                                    height: minimized,
                                });
                                setMinimized(false);
                                // Jank
                                setTimeout(() => globalThis.monacoEditor?.layout(), 100);
                            } else {
                                const currentSize = getRndSize();
                                console.log(currentSize);
                                rndRef.current!.updateSize({
                                    width: currentSize.width,
                                    height: TITLE_BAR_HEIGHT,
                                });
                                setMinimized(currentSize.height);
                            }
                        }}
                    />
                    <WindowButton
                        color="#00ac00"
                        onClick={() => {
                            if (maximized) {
                                rndRef.current!.updateSize(maximized.size);
                                rndRef.current!.updatePosition(maximized.position);
                                document.body.style.overflow = "inherit";
                                setMaximized(false);
                            } else {
                                if (minimized) {
                                    setMinimized(false);
                                }
                                setMaximized({
                                    size: getRndSize(),
                                    position: rndRef.current!.getDraggablePosition(),
                                });
                                rndRef.current!.updateSize({
                                    width: document.body.offsetWidth - 1,
                                    height: document.body.offsetHeight - 1,
                                });
                                rndRef.current!.updatePosition({ x: 0, y: 0 });
                                document.body.style.overflow = "hidden";
                            }
                            // Jank
                            setTimeout(() => globalThis.monacoEditor?.layout(), 100);
                        }}
                    />
                    <WindowButton
                        color="red"
                        onClick={() => {
                            document.body.style.overflow = "inherit";
                            onClose();
                        }}
                    />
                </div>

                <div
                    data-rnd-cancel
                    className={css`
                        flex: 1;
                        background-color: white;
                        cursor: initial;
                        display: ${minimized ? "none" : "flex"};
                        border: 1px solid lightgray;
                        border-top: 0px;
                        overflow: hidden;
                        padding: 0.5rem 0 0 0.5rem;
                    `}
                >
                    {children}
                </div>
            </div>
        </Rnd>
    );
}
