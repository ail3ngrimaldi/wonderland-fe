import { Card, CardContent, Typography, Box, Button } from '@mui/material'

interface ActionCardProps {
  icon: string
  title: string
  description: string
  buttonText: string
  color: string
  onClick: () => void
}

export function ActionCard({ 
  icon, 
  title, 
  description, 
  buttonText, 
  color, 
  onClick 
}: ActionCardProps) {
  return (
    <Card 
      sx={{ 
        width: 300,
        minHeight: 280,
        textAlign: 'center',
        p: 2,
        borderRadius: 3,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        {/* Icono grande */}
        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
          {icon}
        </Typography>

        {/* Título */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        {/* Descripción */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        {/* Botón de acción */}
        <Button
          variant="contained"
          onClick={onClick}
          sx={{ 
            bgcolor: color,
            '&:hover': {
              bgcolor: color,
              opacity: 0.9
            }
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}