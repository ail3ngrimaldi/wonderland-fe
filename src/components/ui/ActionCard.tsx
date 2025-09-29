import { Card, CardContent, Typography, Button } from '@mui/material'

interface ActionCardProps {
  icon: string
  title: string
  description: string
  buttonText: string
  color: string
  onClick: () => void
  height?: number | string
  transparent?: boolean
  clickableCard?: boolean
  testId?: string
}

export function ActionCard({
  icon,
  title,
  description,
  buttonText,
  color,
  onClick,
  height = 320,
  transparent = false,
  clickableCard = false,
  testId,
}: ActionCardProps) {
  const baseStyles = {
    height: height,
    width: { xs: '100%', sm: '300px', md: 'auto' },
    maxWidth: { xs: '400px', md: '350px' },
    flex: { md: '1 1 250px' },
    textAlign: 'center',
    p: 2,
    borderRadius: 3,
    backgroundColor: transparent ? 'transparent' : 'background.paper',
    border: transparent ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    backdropFilter: transparent ? 'blur(10px)' : 'none',
    transition: 'transform 0.2s ease-in-out',
  }

  if (clickableCard) {
    return (
      <Card
        data-testid={testId || 'action-card'}
        onClick={onClick}
        sx={{
          ...baseStyles,
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Card
        sx={{
          ...baseStyles,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3,
          },
        }}
      >
        <CardContent>
          <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
            {icon}
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Button
            data-testid={testId || 'action-card-button'}
            variant="contained"
            onClick={onClick}
            sx={{
              bgcolor: color,
              '&:hover': {
                bgcolor: color,
                opacity: 0.9,
              },
            }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    )
  }
}
