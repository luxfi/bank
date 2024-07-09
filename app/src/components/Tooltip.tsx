import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";

import styled from "styled-components";

export default function Tooltip({ text }: { text: string }) {
    return (
        <>
            <Icon icon={faAsterisk} data-tip={text} />
            <ReactTooltip effect="solid" />
        </>
    );
}

const Icon = styled(FontAwesomeIcon)`
    position: relative;
    top: -5px;
    font-size: 0.7em;
    color: red;
    padding: 0px 5px;
`;
