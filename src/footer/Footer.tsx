import {
  Container,
  Grid,
  Text,
  Flex,
  Box,
  IconButton,
  Tooltip,
} from "@radix-ui/themes";
import { GitHubLogoIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { open } from "@tauri-apps/api/shell";

import "./Footer.css";

const Footer = () => {
  return (
    <footer
      id="footer"
      style={{
        backgroundColor: "var(--bronze-11)",
        padding: "20px",
        margin: "0",
        borderTop: "0px",
        height: "40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Grid columns="2" rows="1" gap="9">
          <Box>
            <Text
              style={{ fontFamily: "Georgia", color: "var(--bronze-4)" }}
              size="2"
              weight="light"
            >
              &copy; 2024 MochaGen by CKEFGISC
            </Text>
          </Box>
          <Flex gap="3" justify="end">
            <Tooltip content="Source Code">
              <IconButton
                size="1"
                onClick={() => open("https://github.com/CKEFGISC/MochaGen")}
              >
                <GitHubLogoIcon width="18" height="18" />
              </IconButton>
            </Tooltip>
            <Tooltip content="About">
              <IconButton
                size="1"
                onClick={() => open("https://github.com/CKEFGISC/MochaGen")}
              >
                <InfoCircledIcon width="18" height="18" />
              </IconButton>
            </Tooltip>
          </Flex>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
