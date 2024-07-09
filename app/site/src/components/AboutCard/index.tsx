"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Modal as AntModal } from "antd";
import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

import AnimatedDiv from "../AnimatedDiv";
import Text from "../Text";

const CardContainer = styled(AnimatedDiv)<{ $hasBio: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 380px;
  padding: ${({ theme }) => theme.size["16px"]};
  border-radius: ${({ theme }) => theme.size["24px"]};
  cursor: ${({ $hasBio }) => ($hasBio ? "pointer" : "default")};
  transition: all 0.2s ease-in-out;

  &:hover {
    ${({ $hasBio }) => ($hasBio ? "background-color: #f4f4f4;" : "")}
  }

  img {
    filter: grayscale(100%);
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size["48px"]};
`;

const PictureModalContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.size["48px"]};
  img {
    max-width: 380px;
    filter: grayscale(100%);
  }
  @media ${DeviceSize.sm} {
    flex-direction: column;
  }
`;

const Modal = styled(AntModal)`
  border-radius: ${({ theme }) => theme.size["64px"]};

  .ant-modal-content {
    border-radius: ${({ theme }) => theme.size["24px"]} !important;
  }
`;

export interface IMember {
  picture: string;
  name: string;
  role: string;
  summary: string;
  bio: string;
  link?: string;
  textLink?: string;
}

interface IData {
  member: IMember;
}
export default function AboutCard({ member }: IData) {
  const [modalOpen, setModalOpen] = useState(false);
  const link = member.link ? (
    <Link
      href={member.link}
      target="_blank"
      style={{
        color: "#00569e",
        fontSize: "2rem",
        textDecoration: "none",
        lineHeight: "3.2rem",
      }}
    >
      {member.textLink}
    </Link>
  ) : null;
  return (
    <>
      <CardContainer
        $hasBio={member.bio ? true : false}
        onClick={() => {
          if (!member.bio) return;
          setModalOpen(!modalOpen);
        }}
      >
        <Image
          src={member.picture}
          alt={member.name}
          width={380}
          height={392}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <Text variant="subtitle">{member.name}</Text>
        <Text variant="body_lg" color={"#1E3456"}>
          {member.role}
        </Text>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Text variant="body" color={"#1E3456"}>
            {member.summary}
          </Text>
          {link && link}
        </div>
      </CardContainer>
      <Modal
        rootClassName="modal"
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        width={810}
        centered
      >
        <ModalContent>
          <PictureModalContainer>
            <Image
              src={member.picture}
              alt={member.name}
              width={380}
              height={392}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
            <div>
              {member.role && <Text variant="subtitle">{member.name}</Text>}
              <Text variant="body">{member.role}</Text>
            </div>
          </PictureModalContainer>
          <Text variant="body" color={"#1E3456"}>
            {member.bio}
          </Text>
        </ModalContent>
      </Modal>
    </>
  );
}
