<template>
  <div class="contact-page">
    <ClientOnly>
      <TheHeader />
    </ClientOnly>
    <ContactSection />
    <TheFooter />
  </div>
</template>

<script setup>
// SEO Meta tags
useSeoMeta({
  title: 'Contacto - Euro Inmo',
  description: 'Ponte en contacto con Euro Inmo. Estamos aquí para ayudarte a encontrar tu propiedad ideal en el Oriente Antioqueño.',
  ogTitle: 'Contacto - Euro Inmo',
  ogDescription: 'Ponte en contacto con Euro Inmo. Estamos aquí para ayudarte.',
  ogImage: '/logotipo-euro.svg',
  twitterCard: 'summary_large_image'
})
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
