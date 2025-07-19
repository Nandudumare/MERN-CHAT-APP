import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar, Button } from "@chakra-ui/react";
import { ChatContext } from "../context/ChatProvider";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Flex } from "@chakra-ui/layout";
import { chatColors } from "../colors";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useContext(ChatContext);

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/api/chat`,
        config
      );
      console.log("data:", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={chatColors.periwinkle}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Rubik"}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            bg={chatColors.periwinkle}
            fontFamily={"Rubik"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        bg={chatColors.dusty_rose}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Flex
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={
                  selectedChat === chat
                    ? chatColors.light_lavender
                    : "rgba(255, 255, 255, 0.15)"
                }
                px={3}
                py={2}
                backdropFilter="blur( 3px )"
                borderRadius="lg"
                key={chat._id}
              >
                <div>
                  <Avatar
                    size="md"
                    src={
                      !chat.isGroupChat
                        ? chat.users[0]._id === user._id
                          ? chat.users[1].pic
                          : chat.users[0].pic
                        : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                  />
                </div>
                <Box px={3} py={0.5}>
                  <Text fontFamily={"Rubik"}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage[0] && (
                    <Text fontSize="xs" fontFamily={"Rubik"}>
                      <b>{chat.latestMessage[0].sender.name} : </b>
                      {chat.latestMessage[0].content.length > 50
                        ? chat.latestMessage[0].content.substring(0, 51) + "..."
                        : chat.latestMessage[0].content}
                    </Text>
                  )}
                </Box>
              </Flex>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
