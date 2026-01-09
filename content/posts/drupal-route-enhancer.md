---
date: 2026-01-07
author: Thierry
tags: 
  - drupal
readingTime: true
hideComments: true
title: Drupal Route Enhancer
---

# Drupal Route Enhancer


Drupal permet la modification des paramètres par défaut d'une route via l'injection de dépendances. Cela permet de personnaliser les paramètres de la route en fonction des besoins spécifiques de l'application.

Vous savez le fameu `_default` de chaque route, ou encore `_controller` et `_form`, `_title` ou `_title_callback`

Et bien saviez-vous que vous pouviez les surcharger même pour une route existante.

<!--more-->
On peut alors surcharger proprement le controlleur d'une route système.
{{<details summary="docroot/modules/custom/custom_user/custom_user.services.yml" open="true">}}
```yaml
services:
  #...
  custom_user.route_enhancer:
    class: Drupal\custom_user\Routing\RouteEnhancer
    arguments:
      - '@request'
    tags:
      - { name: route_enhancer }
```
{{</details>}}
{{<details summary="docroot/modules/custom/custom_user/src/Routing/RouteEnhancer.php" open="true">}}
```php
<?php

namespace Drupal\custom_user\Routing;

use Drupal\airc\AircSites;
use Drupal\airc_preference\Controller\PreferenceUserAuthenticationController;
use Drupal\Core\Routing\EnhancerInterface;
use Drupal\Core\Routing\RouteObjectInterface;
use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouteCollection;

/**
 * Cette classe surcharge les routes user uniquement pour un certain domaine.
 * @see CustomUserAuthenticationController
 */
class RouteEnhancer implements EnhancerInterface
{
  public function __construct(private Request $request) {
  
  }

  public function enhance(array $defaults, Request $request) {
    if ($this->request->getHost() === 'admin.monsite.com') {
      return $defaults;
    }
    $route_name = $defaults[RouteObjectInterface::ROUTE_NAME] ?? '';
    if('user.login' === $route_name) {
        // Use a controller instead of a form 
      $defaults['_controller'] = '\Drupal\custom_user\Controller\CustomUserAuthenticationController::loginForm';
      unset($defaults['_form']);
    }
    elseif('user.register' === $route_name) {
      $defaults['_controller'] = '\Drupal\custom_user\Controller\CustomUserAuthenticationController::registerForm';
      unset($defaults['_form']);
    }
    elseif('user.pass' === $route_name) {
      $defaults['_controller'] = '\Drupal\custom_user\Controller\CustomUserAuthenticationController::userPassword';
      unset($defaults['_form']);
    }
    elseif('user.pass.http' === $route_name) {
      $defaults['_controller'] = '\Drupal\custom_user\Controller\CustomUserAuthenticationController::resetPassword';
    }

    return $defaults;
  }


}

```
{{</details>}}


Alors vous me direz, tu peux utilisez une RouteSubscriber et le alterRoute pour modifier les routes existantes.
Oui mais le alterRoutes n'est exécuter que lors de la compilation des routes. 
Un `route_enhancer` lui permet de surcharger une route à chaque appel de celle-ci.