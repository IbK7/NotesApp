import styled from "@emotion/styled";
import { Button } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#101820"),
    backgroundColor: '#101820',
    '&:hover': {
      backgroundColor: "#1018FF",
    },
    padding: theme.spacing(1)
}));

export default StyledButton;