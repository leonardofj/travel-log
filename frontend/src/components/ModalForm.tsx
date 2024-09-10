import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: string;
  children: React.ReactNode;
}

const ModalForm = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalFormProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalForm;
