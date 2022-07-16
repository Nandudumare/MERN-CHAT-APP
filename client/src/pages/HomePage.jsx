import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        w="100%"
        m={"40px 0 15px 0"}
        borderWidth={"1px"}
        borderRadius={"lg"}
        bg={"rgba( 255, 255, 255, 0.1 )"}
        boxShadow="0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
        backdropFilter="blur( 4px )"
        border="1px solid rgba( 255, 255, 255, 0.18 )"
      >
        <Text
          fontSize="4xl"
          fontFamily={"Neucha"}
          color="#efefef"
          textAlign={"center"}
        >
          Chat Application
        </Text>
      </Box>
      <Box
        borderRadius={"lg"}
        bg={"rgba( 255, 255, 255, 0.1 )"}
        boxShadow="0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
        backdropFilter="blur( 4px )"
        border="1px solid rgba( 255, 255, 255, 0.18 )"
        w="100%"
        p={4}
        borderWidth="1px"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab color="white">Login</Tab>
            <Tab color="white">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
