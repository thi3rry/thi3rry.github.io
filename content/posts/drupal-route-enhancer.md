---
date: 2026-01-07
author: Thierry
tags: ["drupal"]
readingTime: true
hideComments: true
title: Drupal Route Enhancer
---

# Drupal Route Enhancer

Imaginez la situation : vous avez un site Drupal multidomain. Sur le domaine principal, les pages de connexion, d'inscription et de mot de passe oublié doivent avoir une tête complètement différente — votre propre contrôleur, votre propre logique — mais sur le domaine d'administration, on garde le comportement Drupal standard. Pas question de modifier le cœur de Drupal, et pas question non plus de dupliquer des routes dans tous les sens.

C'est exactement le problème que le `route_enhancer` résout proprement.

## Comparaison avec RouteSubscriber

Vous connaissez sûrement le `_controller`, le `_form`, le `_title_callback`… tous ces paramètres par défaut qui définissent ce que Drupal fait quand une route est appelée. Et vous savez probablement aussi qu'on peut modifier une route existante via un `RouteSubscriber` avec la méthode `alterRoutes`.

Sauf que — et c'est là que ça coince — `alterRoutes` n'est exécuté **qu'à la compilation des routes**. Autrement dit, une seule fois, au cache clear. Impossible donc d'adapter le comportement en fonction d'une condition dynamique comme le domaine courant.

C'est là qu'intervient le `route_enhancer` : lui est appelé **à chaque requête**, ce qui permet de prendre des décisions à la volée.

## Mise en place

Deux fichiers suffisent : la déclaration du service, et la classe qui fait le travail.

### 1. Déclarer le service

{{<details summary="docroot/modules/custom/custom_user/custom_user.services.yml" open="true">}}
```yaml
services:
  custom_user.route_enhancer:
    class: Drupal\custom_user\Routing\RouteEnhancer
    arguments:
      - '@request'
    tags:
      - { name: route_enhancer }
```
{{</details>}}

Le tag `route_enhancer` est ce qui dit à Drupal "hé, ce service veut s'intercaler dans le traitement des routes". Sans lui, votre classe existe mais ne sera jamais appelée.

### 2. Implémenter l'interface

{{<details summary="docroot/modules/custom/custom_user/src/Routing/RouteEnhancer.php" open="true">}}
```php
<?php

namespace Drupal\custom_user\Routing;

use Drupal\Core\Routing\EnhancerInterface;
use Drupal\Core\Routing\RouteObjectInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Surcharge les routes user selon le domaine courant.
 * @see CustomUserAuthenticationController
 */
class RouteEnhancer implements EnhancerInterface
{
  public function __construct(private Request $request) {}

  public function enhance(array $defaults, Request $request): array
  {
    // Sur le domaine admin, on ne touche à rien
    if ($this->request->getHost() === 'admin.monsite.com') {
      return $defaults;
    }

    $route_name = $defaults[RouteObjectInterface::ROUTE_NAME] ?? '';

    $overrides = [
      'user.login'     => 'loginForm',
      'user.register'  => 'registerForm',
      'user.pass'      => 'userPassword',
    ];

    if (isset($overrides[$route_name])) {
      $defaults['_controller'] = '\Drupal\custom_user\Controller\CustomUserAuthenticationController::' . $overrides[$route_name];
      unset($defaults['_form']);
    }

    if ($route_name === 'user.pass.http') {
      $defaults['_controller'] = '\Drupal\custom_user\Controller\CustomUserAuthenticationController::resetPassword';
    }

    return $defaults;
  }
}
```
{{</details>}}


La méthode `enhance` reçoit le tableau `$defaults` de la route (tous ses paramètres) et peut les modifier avant que Drupal ne dispatche la requête. On remplace `_controller`, on supprime `_form` si nécessaire, et on retourne le tableau modifié. Simple, chirurgical.

> ⚠️ **Attention aux performances** : justement parce qu'un `route_enhancer` est exécuté à chaque requête, il faut être vigilant sur ce qu'on y met. Des appels à la base de données, des services lourds ou des logiques complexes à cet endroit peuvent avoir un impact significatif sur les temps de réponse. On garde ça léger — des comparaisons simples, pas de I/O.

## Ce qu'il faut savoir

- **`RouteSubscriber::alterRoutes`** → modifie les routes à la compilation (cache clear). Idéal pour des changements statiques et définitifs.
- **`route_enhancer`** → s'exécute à chaque requête. Idéal pour des conditions dynamiques (domaine, rôle utilisateur, feature flag…).

## Pour aller plus loin

Ce pattern est puissant dès qu'on a des besoins multi-contexte. On pourrait tout à fait l'utiliser pour adapter une route en fonction du rôle de l'utilisateur connecté, d'un paramètre de configuration, ou même d'un header HTTP. La [documentation officielle de Drupal sur le routing](https://www.drupal.org/docs/drupal-apis/routing-system/routing-system-overview) donne une bonne vue d'ensemble si vous voulez creuser le sujet.