import { Box, Button, Container, Typography } from '@mui/material'
import { ActionCard } from './ActionCard'
import { useNavigate } from 'react-router-dom'

export function HeroSection() {
const navigate = useNavigate()
            return (
                <Container>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                        <Box sx={{ flex: 1, textAlign: 'left' }}>
                            <Typography   
                                variant="h4"
                                component="h1"
                                gutterBottom>
                                🌍 Welcome to your Impact Dashboard
                            </Typography>
                            <Typography 
                                variant="h6"
                                color="text.secondary">
                                Your actions create real change in the world
                            </Typography>
                        </Box>

                        <Box sx={{ ml: 3 }}>
                            <ActionCard
                                icon=""
                                title="Impact History"
                                description="127 eco-tokens • 3 projects supported • View all transactions"
                                buttonText="View History"
                                color="#FF9800"
                                onClick={() => navigate('/impact-history')}
                                height={220}
                                transparent={true}
                                clickableCard={true}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md:'space-between' },
                            flexWrap: 'wrap',
                            gap: { xs: 2, md: 1 }
                        }}
                    >                
                        <ActionCard
                            icon="🌱"
                            title="Plant Seeds"
                            description="Generate eco-tokens to support sustainable projects and earn rewards"
                            buttonText="Start Planting"
                            color="#4CAF50"
                            onClick={() => navigate('/plant-seeds')}
                        />
                        <ActionCard
                            icon="🤝"
                            title="Sponsor Project"
                            description="Give permission to support meaningful causes and environmental initiatives"
                            buttonText="Become Sponsor"
                            color="#2196F3"
                            onClick={() => navigate('/sponsor-project')}
                        />
                        <ActionCard
                            icon="💚"
                            title="Make Impact"
                            description="Send your eco-tokens to create real change in the world"
                            buttonText="Start Donating"
                            color="#388E3C"
                            onClick={() => navigate('/make-impact')}
                        />
                    </Box>
                </Container>
            )
}