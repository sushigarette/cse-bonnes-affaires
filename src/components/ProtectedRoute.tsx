import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth()

  // Afficher le loader pendant le chargement de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Vérification de l'authentification</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin) {
    // Vérifier si l'utilisateur est admin
    // Pour l'instant, on vérifie simplement si l'email contient "admin"
    // Dans un vrai projet, vous devriez vérifier le rôle dans la base de données
    const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin'
    
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-96">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Accès refusé</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
              <Button onClick={() => window.history.back()}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
