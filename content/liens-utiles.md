+++
menu = 'main'
title = 'Liens utiles'
weight = 30
+++


# Liens utiles

## Native HTMX in Drupal 11.3.0: Rich UX with up to 71% less JavaScript - 2025-12-18

https://www.drupal.org/about/core/blog/native-htmx-in-drupal-1130-rich-ux-with-up-to-71-less-javascript
## back in 90s : "30 years of br tags" - 2025-12-18

https://www.artmann.co/articles/30-years-of-br-tags
## protocol de diffusion de l'information gemini

https://www.bortzmeyer.org/gemini.html

#lowtech web
## git push multi remote - 2025-11-23

[Git voit double — Rancune](https://rancune.org/posts/git-again/)
#git

## git overview - 2025-11-02

![[IMG_9741.jpeg]]

https://www.reddit.com/r/git/s/ZASxpycVBt
git-overview checks the status of local and remote commits of many git repositories in the same directory.
It's ideal when you work with other people and want to quickly check what was recently committed.

For example, you work on several repositories with remote colleagues in different time zones in your team, and in the morning you want to know what was updated yesterday.

git overview mydirectory will give you that quick overview you need to start your day !

On Pypi: https://pypi.org/project/git-overview/

On Github: https://github.com/yimyom/git-overview

## PHP 2025 / Pint / Rector / PhpStan

https://youtu.be/cfD7uCWXxZk?si=e2CduG0wDqUntrme
## User onboarding tour

Script JS permettant de faire des tuto intégré à la page avec étapes #onboarding #tour #user

https://introjs.com/docs
Voir aussi : https://driverjs.com/docs/installation
## Symfony 7 single file application

https://symfony.com/blog/new-in-symfony-7-2-simpler-single-file-symfony-applications
Symfony 7 permet de faire des applications ultra simple dans un seul fichier



```php
// index.php

use App\Generator\NumberGenerator;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Attribute\Route;

require __DIR__.'/vendor/autoload.php';

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    #[Route('/random/{limit}', name: 'random_number')]
    public function __invoke(int $limit, NumberGenerator $numberGenerator): JsonResponse
    {
        return new JsonResponse([
            'number' => $numberGenerator->generate($limit),
        ]);
    }
}

return static function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
}
```
## Draw.io

Logiciel desktop offline de dessin/schéma UML comme https://app.diagrams.net/?src=about

Téléchargement de l'app desktop : https://github.com/jgraph/drawio-desktop

## Tart : Virtualization sur mac os silicon

https://korben.info/apple-silicon-virtualisation-tart-pleine-puissance.html

## Captvty

Sujet reddit sur les pub dans les replays oqee : https://www.reddit.com/r/france/s/5wQO6XuBio

Accédez, depuis un point unique grâce à Captvty, aux directs et à une multitude d’émissions proposées au rattrapage par différentes chaînes de télévision.

Captvty est gratuit et espère satisfaire de nombreux utilisateurs.

[https://captvty.fr](https://captvty.fr/)

## PHP Generators instead of arrays

https://medium.com/better-programming/a-quick-performance-optimization-example-using-php-generators-9e71aac810e0

## Appareil de musculation poids de corps

https://www.infinyfit.fr/fr/

## CiviCRM - Projet de CRM open source sous Drupal - 29/04/2025
#crm  #drupal

https://civicrm.com/fr/page-daccueil/

## Crew AI Framework Agent IA - 28/04/2025

https://www.crewai.com/

## Un scrapper de site - 26/04/2025

Alternative à Screaming FROG
Open source
Multi-plateforme codé en JAVA
https://beamusup.com/

-> Le README contient des infos utiles pour créer des APP MacOS et décrit comment fonctionne le package "App" sous mac os

