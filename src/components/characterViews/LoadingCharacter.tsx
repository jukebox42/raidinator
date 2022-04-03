import {
  Box,
  Stack,
  Skeleton,
} from "@mui/material";

const LoadingCharacter = () => {
  return (
    <>
      <Box sx={{ p: 0, m: 1, display: "flex", flexDirection: "row" }}>
        <Skeleton variant="rectangular" animation="wave" width={55} height={55}/>
        <Box sx={{ flexGrow: 1, ml: 1 }}>
          <Skeleton variant="rectangular" animation="wave" height={30} sx={{mb: 1}} />
          <Skeleton variant="rectangular" animation="wave" height={20} />
        </Box>
      </Box>
      <Stack direction="row" sx={{ ml: 1 }}>
        {/* TODO: Make a wrapper to angle it so it's a diamond */}
        <Skeleton variant="rectangular" animation="wave" width={55} height={55} sx={{ mr: 1 }} />
        <Skeleton variant="rectangular" animation="wave" width={55} height={55} sx={{ mr: 1 }} />
        <Skeleton variant="rectangular" animation="wave" width={55} height={55} sx={{ mr: 1 }} />
        <Skeleton variant="rectangular" animation="wave" width={55} height={55} sx={{ mr: 1 }} />
        <Skeleton variant="rectangular" animation="wave" width={55} height={55} sx={{ mr: 1 }} />
      </Stack>
      <Box sx={{ ml: 1, display: "flex", flexDirection: "row" }}>
        <Box sx={{ width: "55px", mt: 1 , ml: 1 }}></Box>
        <Skeleton variant="rectangular" animation="wave" width={235} height={25} sx={{ mt: 1}}/>
      </Box>
    </>
  )
}

export default LoadingCharacter;
