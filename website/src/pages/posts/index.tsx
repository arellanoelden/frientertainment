import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Avatar,
  Rating,
  Box,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CreatePost from "./CreatePost";
import { Stack } from "@mui/material";

const MovieReviewCard = ({ movie }: any) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={movie.image}
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {movie.review}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 24, height: 24 }}>{movie.reviewer[0]}</Avatar>
          <Typography variant="body2">{movie.reviewer}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Box display="flex" gap={1}>
          <IconButton aria-label="like">
            <FavoriteIcon color="error" />
          </IconButton>
          <IconButton aria-label="comment">
            <ChatBubbleOutlineIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </Box>
        <Rating value={movie.rating} precision={0.5} readOnly />
      </CardActions>
    </Card>
  );
};

const MovieReviewGrid = ({ movies }: any) => {
  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {movies.map((movie: any, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <MovieReviewCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Example movie data
const sampleMovies = [
  {
    title: "Interstellar",
    image: "https://m.media-amazon.com/images/I/81k8o2u1sIL._AC_SY679_.jpg",
    review:
      "A visually stunning journey through time and space with emotional depth.",
    reviewer: "John Doe",
    rating: 4.5,
  },
  {
    title: "Inception",
    image: "https://m.media-amazon.com/images/I/91zjIaK+qUL._AC_SL1500_.jpg",
    review: "Mind-bending thriller that keeps you guessing until the end.",
    reviewer: "Jane Smith",
    rating: 4.7,
  },
  {
    title: "The Dark Knight",
    image: "https://m.media-amazon.com/images/I/71pG5yyHS6L._AC_SY679_.jpg",
    review:
      "Heath Ledger delivers a legendary performance in a gripping superhero tale.",
    reviewer: "Alex Roe",
    rating: 5.0,
  },
];

export default function MovieList() {
  return (
    <Stack>
      <MovieReviewGrid movies={sampleMovies} />
      <CreatePost />
    </Stack>
  );
}
