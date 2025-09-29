import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function HistoryButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="outlined"
      onClick={() => navigate('/impact-history')}
      sx={{
        position: 'absolute',
        top: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        zIndex: 10,
      }}
      startIcon="📊"
      color="secondary"
    >
      View Impact History
    </Button>
  )
}
