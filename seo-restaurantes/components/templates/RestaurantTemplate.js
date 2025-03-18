// RestaurantTemplate.js
// Template reutilizável para páginas de restaurantes com otimização SEO

import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { gerarConteudoRestaurante, gerarDescricaoCurta, gerarTituloOtimizado } from '@/utils/contentGenerator';
import RestaurantGallery from '@/components/RestaurantGallery';
import RestaurantImage from '@/components/RestaurantImage';
import { generateImageMetaTags, IMAGE_TYPES } from '@/utils/imageHelpers';
import styles from './RestaurantTemplate.module.css';

export default function RestaurantTemplate({ restaurant, relatedRestaurants }) {
  // Gerar conteúdo dinâmico
  const conteudo = gerarConteudoRestaurante(restaurant);
  const titulo = gerarTituloOtimizado(restaurant);
  const descricao = gerarDescricaoCurta(restaurant);

  // Dados estruturados Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant.name,
    "image": restaurant.images.map(img => img.url),
    "description": descricao,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${restaurant.address.street}, ${restaurant.address.number}`,
      "addressLocality": restaurant.neighborhood,
      "addressRegion": restaurant.state,
      "addressCountry": "BR",
      "postalCode": restaurant.address.zipCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": restaurant.address.coordinates.latitude,
      "longitude": restaurant.address.coordinates.longitude
    },
    "url": restaurant.website,
    "telephone": restaurant.phone,
    "openingHoursSpecification": Object.entries(restaurant.operatingHours).map(([day, hours]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": day,
      "opens": hours.split('-')[0],
      "closes": hours.split('-')[1]
    })),
    "priceRange": restaurant.priceRange,
    "servesCuisine": restaurant.cuisine,
    "menu": {
      "@type": "Menu",
      "hasMenuSection": {
        "@type": "MenuSection",
        "name": "Pratos em Destaque",
        "hasMenuItem": restaurant.menuHighlights.map(dish => ({
          "@type": "MenuItem",
          "name": dish.name,
          "description": dish.description,
          "offers": {
            "@type": "Offer",
            "price": dish.price,
            "priceCurrency": "BRL"
          }
        }))
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": restaurant.rating,
      "reviewCount": restaurant.reviewCount
    }
  };

  // Gera as metatags para imagens
  const imageMetaTags = generateImageMetaTags(restaurant);

  return (
    <>
      <Head>
        <title>{titulo}</title>
        <meta name="description" content={descricao} />
        <meta name="keywords" content={restaurant.keywords.join(', ')} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={titulo} />
        <meta property="og:description" content={descricao} />
        <meta property="og:url" content={`https://guia-restaurantes.com.br/restaurantes/${restaurant.slug}`} />
        <meta property="og:type" content="restaurant" />
        
        {/* Tags de imagem com implementação otimizada */}
        {imageMetaTags.map((meta, index) => (
          <meta key={`${meta.property}-${index}`} property={meta.property} content={meta.content} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titulo} />
        <meta name="twitter:description" content={descricao} />
      </Head>

      {/* Schema.org JSON-LD */}
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <article className={styles.restaurantPage}>
        {/* Galeria de Imagens Otimizada */}
        <section className={styles.imageGallery}>
          <RestaurantGallery 
            restaurant={restaurant}
            maxImages={6}
            aspectRatio={4/3}
            onImageClick={(image, index) => {
              console.log('Imagem clicada:', image, index);
              // Aqui poderia abrir um modal com a galeria completa
            }}
          />
        </section>

        {/* Informações Principais */}
        <header className={styles.header}>
          <h1>{restaurant.name}</h1>
          <div className={styles.metaInfo}>
            <span className={styles.rating}>⭐ {restaurant.rating}/5</span>
            <span className={styles.reviews}>({restaurant.reviewCount} avaliações)</span>
            <span className={styles.priceRange}>{restaurant.priceRange}</span>
          </div>
          <p className={styles.location}>
            {restaurant.neighborhood}, {restaurant.city} - {restaurant.state}
          </p>
        </header>

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: conteudo }} />
          
          {/* Menu em Destaque */}
          <section className={styles.menuHighlights}>
            <h2>Destaques do Menu</h2>
            <div className={styles.menuGrid}>
              {restaurant.menuHighlights.map((dish, index) => (
                <div key={index} className={styles.menuItem}>
                  <h3>{dish.name} {dish.isSignatureDish && '⭐'}</h3>
                  <p>{dish.description}</p>
                  <p className={styles.price}>R$ {dish.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Restaurantes Relacionados */}
          <section className={styles.relatedRestaurants}>
            <h2>Restaurantes Relacionados</h2>
            <div className={styles.relatedGrid}>
              {relatedRestaurants.map(related => (
                <Link 
                  key={related.id} 
                  href={`/restaurantes/${related.slug}`}
                  className={styles.relatedCard}
                >
                  {/* Imagem Otimizada */}
                  <div className={styles.relatedImageWrapper}>
                    <RestaurantImage
                      restaurant={related}
                      imageType={IMAGE_TYPES.EXTERIOR}
                      priority={false}
                      width={300}
                      height={200}
                      showRestaurantInfo={false}
                    />
                  </div>
                  
                  <div className={styles.relatedInfo}>
                    <h3>{related.name}</h3>
                    <p>{Array.isArray(related.cuisine) ? related.cuisine.join(', ') : related.cuisine}</p>
                    <p>{related.neighborhood}, {related.city}</p>
                    <span className={styles.rating}>⭐ {related.rating}/5</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Atrações Próximas */}
          <section className={styles.nearbyAttractions}>
            <h2>Atrações Próximas</h2>
            <div className={styles.attractionsGrid}>
              {restaurant.nearbyAttractions.map((attraction, index) => (
                <div key={index} className={styles.attractionCard}>
                  <h3>{attraction}</h3>
                  <Link href={`/atracoes/${attraction.toLowerCase().replace(/\s+/g, '-')}`}>
                    Saiba mais
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Informações de Contato */}
        <footer className={styles.footer}>
          <div className={styles.contactInfo}>
            <h3>Informações de Contato</h3>
            <p>Endereço: {restaurant.address.street}, {restaurant.address.number}</p>
            <p>Telefone: {restaurant.phone}</p>
            <p>Website: <a href={restaurant.website} target="_blank" rel="noopener noreferrer">{restaurant.website}</a></p>
          </div>
          
          <div className={styles.socialMedia}>
            <h3>Redes Sociais</h3>
            {restaurant.socialMedia.instagram && (
              <a href={`https://instagram.com/${restaurant.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {restaurant.socialMedia.facebook && (
              <a href={`https://facebook.com/${restaurant.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
          </div>
        </footer>
      </article>
    </>
  );
} 