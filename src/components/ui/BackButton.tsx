import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <Button 
      variant="outlined" 
      onClick={() => navigate('/')}
      sx={{ mb: 3, mt: 2 }}
      startIcon="⬅️"
    >
      Back to Home
    </Button>
  )
}