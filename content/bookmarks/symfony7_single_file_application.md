+++
title = "Symfony 7 single file application"
showFullContent = true
tags = ["symfony", "php"]
+++

https://symfony.com/blog/new-in-symfony-7-2-simpler-single-file-symfony-applications
Symfony 7 permet de faire des applications ultra simple dans un seul fichier

Vive les traits `use MicroKernelTrait;` et les Attributes `#[Route()]`

<!--more-->

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
