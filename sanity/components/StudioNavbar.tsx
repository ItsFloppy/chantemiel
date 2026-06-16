'use client'

import { ArrowLeftIcon } from '@sanity/icons'
import { Box, Button, Card, Flex } from '@sanity/ui'
import type { NavbarProps } from 'sanity'

/**
 * Barre de navigation du Studio avec un bouton « Retour au site ».
 * Sanity n'en fournit pas par défaut : on rend la navbar standard
 * (`renderDefault`) et on y accole un lien vers la page d'accueil.
 */
export function StudioNavbar(props: NavbarProps) {
  return (
    <Flex align="stretch">
      <Card borderBottom>
        <Flex align="center" style={{ height: '100%' }} paddingX={2}>
          <Button
            as="a"
            href="/"
            icon={ArrowLeftIcon}
            text="Retour au site"
            mode="bleed"
            tone="primary"
            fontSize={1}
          />
        </Flex>
      </Card>
      <Box flex={1}>{props.renderDefault(props)}</Box>
    </Flex>
  )
}
