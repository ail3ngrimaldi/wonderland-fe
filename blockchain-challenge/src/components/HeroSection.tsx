import { Box, Button, Container, Typography } from '@mui/material'
import { ActionCard } from './ActionCard'
import { MintButtons } from './MintButtons'
import { TokenOperations } from './TokenOperations'
import { useState } from 'react'

export function HeroSection() {
const [currentView, setCurrentView] = useState<'home' | 'mint' | 'approve' | 'transfer'>('home')

    const renderCurrentView = () => {
        switch (currentView) {
            case 'mint':
                return (
                    <Container>
                        <Button 
                            variant="outlined" 
                            onClick={() => setCurrentView('home')}
                            sx={{ mb: 3, mt: 2 }}
                            startIcon="⬅️"
                        >
                        Back to Dashboard
                        </Button>
                        <MintButtons />
                    </Container>
                )
            case 'approve':
                return (
                    <Container>
                        <Button 
                            variant="outlined" 
                            onClick={() => setCurrentView('home')}
                            sx={{ mb: 3, mt: 2 }}
                            startIcon="⬅️"
                        >
                        Back to Dashboard
                        </Button>
                        <TokenOperations defaultOperation="approve" />
                    </Container>
                )
            case 'transfer':
                return (
                    <Container>
                        <Button 
                            variant="outlined" 
                            onClick={() => setCurrentView('home')}
                            sx={{ mb: 3, mt: 2 }}
                            startIcon="⬅️"
                        >
                        Back to Dashboard
                        </Button>
                        <TokenOperations defaultOperation="transfer" />
                    </Container>
                )
            default:
                return (
                    <Container>
                        <Box   
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            mb: 4
                        }}>
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
                            <Box>
                                <Typography variant="body1">Total Impact: 127 eco-tokens</Typography>
                                <Typography variant="body1">+3 projects supported</Typography>
                            </Box>
                            <Box
                                sx={{
                                display: 'flex',
                                gap: 3,
                                mt: 4,
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                                }}
                            >                
                            <ActionCard
                                    icon="🌱"
                                    title="Plant Seeds"
                                    description="Generate eco-tokens to support 
                            sustainable projects and earn rewards"
                                    buttonText="Start Planting"
                                    color="#4CAF50"
                                    onClick={() => setCurrentView('mint')}
                                />
                                <ActionCard
                                    icon="🤝"
                                    title="Sponsor Project"
                                    description="Give permission to support meaningful 
                            causes and environmental initiatives"
                                    buttonText="Become Sponsor"
                                    color="#2196F3"
                                    onClick={() => setCurrentView('approve')}
                                />
                                <ActionCard
                                    icon="💚"
                                    title="Make Impact"
                                    description="Send your eco-tokens to create real 
                            change in the world"
                                    buttonText="Start Donating"
                                    color="#388E3C"
                                    onClick={() => setCurrentView('transfer')}
                                />
                            </Box>
                        </Box>
                    </Container>
                )
        }
    }
    return renderCurrentView()
}