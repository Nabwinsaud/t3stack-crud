import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo, todoSchema } from "~/schema/todo.schema";

interface TodoProps {
  isOpen: boolean;
  onClose: () => void;
  todo: (Todo & { id: string }) | null;
  setTodo: React.Dispatch<React.SetStateAction<(Todo & { id: string }) | null>>;
}
export default function CreateTodo(props: TodoProps) {
  const { isOpen, onClose, todo, setTodo } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      isActive: false,
    },
  });

  const toast = useToast();

  const utils = api.useContext();
  const { mutate, isLoading } = api.todo.create.useMutation({
    mutationKey: ["todo"],
    onSuccess: () => {
      onClose();
      toast({
        title: "success",
        description: "Todo created",
        status: "success",
        isClosable: true,
        duration: 1000,
      });
      // utils.todo.invalidate(); // works pretty well
      reset();
    },

    // for inValidation either onSuccess or onSettled can be used
    onSettled() {
      // Sync with server once mutation has settled
      utils.todo.invalidate();
    },
  });

  const { mutate: updateTodo, isLoading: isLoadingUpdate } =
    api.todo.update.useMutation({
      mutationKey: ["update-todo"],
      onSuccess: () => {
        onClose();
        toast({
          title: "success",
          description: "Todo updated",
          status: "success",
          isClosable: true,
          duration: 1000,
        });
        // utils.todo.invalidate(); // works pretty well
        reset();
      },

      // for inValidation either onSuccess or onSettled can be used
      onSettled() {
        // Sync with server once mutation has settled
        utils.todo.invalidate();
      },
    });

  const onSubmit = async (data: Todo) => {
    // Todo: update logic
    // mutate(data);
    todo ? updateTodo({ id: todo.id, ...data }) : mutate(data);
  };

  useEffect(() => {
    if (todo) {
      const { id, ...rest } = todo;
      reset(rest);
    } else {
      reset({ title: "", description: "", isActive: false });
    }
  }, [todo, reset]);
  return (
    <>
      <Modal
        onCloseComplete={() => {
          reset({ title: "", description: "", isActive: false });
          setTodo(null); //* good to clear state i think even without it will be fine
        }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className="text-[16px]">Create Todo </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={errors?.title != null}>
                <FormLabel>Title </FormLabel>
                <Input
                  {...register("title")}
                  size="sm"
                  placeholder="Todo title"
                />
                <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors?.description != null}>
                <FormLabel>Description </FormLabel>
                <Textarea
                  {...register("description")}
                  size="sm"
                  placeholder="Todo Description"
                />
                <FormErrorMessage>
                  {errors?.description?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                className="flex items-center justify-between"
                mt={4}
                isInvalid={errors?.isActive != null}
              >
                <FormLabel>isActive </FormLabel>

                <Checkbox
                  {...register("isActive")}
                  size="sm"
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter className="space-x-3">
              <Button size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                isDisabled={isSubmitting}
                isLoading={isLoading || isLoadingUpdate}
                colorScheme="teal"
                size="sm"
                mr={3}
              >
                {todo ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
