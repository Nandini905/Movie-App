import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Chip, Rating } from '@mui/material';
import { AccessTime, Star } from '@mui/icons-material';

export default function MovieCard({ movie }) {
  // Default values in case movie data is incomplete
  const {
    title = 'Unknown Movie',
    overview = 'No description available',
    poster_path = null,
    release_date = 'Unknown',
    vote_average = 0,
    genre_ids = [],
    id
  } = movie || {};

  // Create poster URL if poster_path exists
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  // Format release date
  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'Unknown';

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        sx={{ 
          height: 400,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        image={posterUrl}
        title={title}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 'bold',
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({releaseYear})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={vote_average / 2} 
            precision={0.1} 
            size="small" 
            readOnly
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {vote_average.toFixed(1)}/10
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            flexGrow: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {overview}
        </Typography>

        {genre_ids && genre_ids.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {genre_ids.slice(0, 3).map((genreId) => (
              <Chip 
                key={genreId} 
                label={`Genre ${genreId}`} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" startIcon={<Star />}>
          Add to Favorites
        </Button>
        <Button size="small" variant="outlined">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
