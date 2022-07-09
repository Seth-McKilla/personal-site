import { FormEvent, useState, useEffect, useRef } from "react";
import {
  Stack,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Container,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { ImCheckmark } from "react-icons/im";

type SubscribeState = "init" | "submitting" | "success" | "fail";

export default function CardSubscribe() {
  const inputEl = useRef<HTMLInputElement>(null);
  const [showSubscribe, setShowSubscribe] = useState<boolean>(false);
  const [subscribeState, setSubscribeState] = useState<SubscribeState>("init");

  const bgColor = useColorModeValue("white", "gray.800");
  const inputBorderColor = useColorModeValue("gray.300", "gray.700");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/subscription", {
        body: JSON.stringify({
          email: inputEl?.current?.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      return setSubscribeState("success");
    } catch (error) {
      return setSubscribeState("fail");
    }
  };

  const handleClose = () => {
    sessionStorage.setItem("subscribeDeclined", "true");
    return setShowSubscribe(false);
  };

  useEffect(() => {
    const subscribeDeclined = sessionStorage.getItem("subscribeDeclined");
    if (!subscribeDeclined) return setShowSubscribe(true);
  }, []);

  return showSubscribe ? (
    <Flex
      position="fixed"
      top={{ base: 10, sm: "auto" }}
      bottom={{ base: "auto", sm: 5 }}
      right={{ base: "auto", sm: 5 }}
      left={{ base: "auto", sm: "auto" }}
      width={{ base: "100%", sm: "auto" }}
      align="center"
      justify="center"
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Container maxW="lg" p={6}>
        <CloseButton
          aria-label="Close"
          size="sm"
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
          }}
          onClick={handleClose}
        />
        <Heading
          as="h2"
          fontSize={{ base: "xl", sm: "2xl" }}
          textAlign="center"
          mb={5}
        >
          Subscribe to the Newsletter
        </Heading>
        <Stack
          direction={{ base: "column", sm: "row" }}
          as="form"
          spacing="12px"
          onSubmit={handleSubmit}
        >
          <FormControl>
            <Input
              variant="solid"
              borderWidth={1}
              color="gray.800"
              _placeholder={{
                color: "gray.400",
              }}
              borderColor={inputBorderColor}
              id="email"
              type="email"
              required
              placeholder="Your Email"
              aria-label="Your Email"
              ref={inputEl}
              disabled={subscribeState !== "init"}
            />
          </FormControl>
          <FormControl w={{ base: "100%", md: "40%" }}>
            <Button
              w="100%"
              colorScheme={subscribeState === "success" ? "green" : "blue"}
              isLoading={subscribeState === "submitting"}
              type={subscribeState === "success" ? "button" : "submit"}
            >
              {subscribeState === "success" ? <ImCheckmark /> : "Submit"}
            </Button>
          </FormControl>
        </Stack>
        <Text
          mt={2}
          textAlign="center"
          color={subscribeState === "fail" ? "red.500" : "gray.500"}
        >
          {subscribeState === "fail"
            ? "Oh no an error occurred! 😢 Please try again later."
            : "One email per week, never any spam 🙅‍♂️"}
        </Text>
      </Container>
    </Flex>
  ) : null;
}
