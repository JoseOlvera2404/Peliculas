<?php
require_once 'includes/auth.php';

if (isLoggedIn()) {
    if (isAdmin()) {
        header('Location: admin/index.php');
    } else {
        header('Location: cliente/index.php');
    }
} else {
    header('Location: login.php');
}
exit();
?>