import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { api } from "~/utils/api";

interface DeleteTodoProps {
  setDeletedId: (id: string | null) => void;
  deletedId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteTodo(props: DeleteTodoProps) {
  const { deletedId, setDeletedId, isOpen, onClose } = props;
  console.log("🚀 ~ file: DeleteTodo.tsx:24 ~ deletedId:", deletedId);

  const utils = api.useContext();

  //   const handleDelete = async () => {

  //   }
  const toast = useToast();

  const { mutate, isLoading } = api.todo.delete.useMutation({
    onSuccess: () => {
      onClose();
      setDeletedId(null);
      utils.todo.invalidate();
      toast({
        title: "success",
        description: "Todo deleted",
        status: "success",
        isClosable: true,
        duration: 1000,
      });
    },
  });
  return (
    <div>
      <Modal
        onCloseComplete={() => {
          setDeletedId(null);
        }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-[16px]">Delete Todo ? </ModalHeader>
          <ModalCloseButton />
          <ModalFooter className="space-x-3">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={isLoading}
              isLoading={isLoading}
              colorScheme="red"
              size="sm"
              mr={3}
              onClick={() => {
                if (deletedId) {
                  mutate({ Id: deletedId });
                }
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
