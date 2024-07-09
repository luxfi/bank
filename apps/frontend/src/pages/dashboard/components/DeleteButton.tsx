import { useState } from "react";
import Button from "../../../components/Button";

export function DeleteButton({
    text = "Delete",
    onClick,
}: {
    text?: string;
    onClick: () => void;
}) {
    const [isClicked, setIsClicked] = useState(false);

    if (isClicked) {
        return (
            <Button
                style={{ margin: "2px" }}
                danger
                size="small"
                onClick={() => {
                    setIsClicked(false);
                    onClick();
                }}
            >
                Confirm
            </Button>
        );
    }

    return (
        <Button
            danger
            size="small"
            onClick={() => setIsClicked(true)}
            style={{ margin: "2px" }}
        >
            {text}
        </Button>
    );
}
