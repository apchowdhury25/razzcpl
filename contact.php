<?php
declare(strict_types=1);

// Enquiry inbox. On Hostinger, create this mailbox first so the From address is accepted.
$to = 'hello@razzcpl.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

function field(string $key, int $max): string
{
    $value = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $value = str_replace(["\r", "\n"], ' ', $value);
    if (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

if (field('company_website', 200) !== '') {
    header('Location: contact.html?sent=1');
    exit;
}

$name = field('name', 120);
$email = field('email', 160);
$phone = field('phone', 40);
$interest = field('interest', 40);
$area = field('area', 160);
$message = trim((string) ($_POST['message'] ?? ''));
if (strlen($message) > 4000) {
    $message = substr($message, 0, 4000);
}

$allowed = ['Landowner', 'Future resident', 'Commercial client'];
if (!in_array($interest, $allowed, true)) {
    $interest = 'Enquiry';
}

if ($name === '' || $phone === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?sent=0#form');
    exit;
}

$subject = 'Website enquiry - ' . $interest;
$body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nInterest: {$interest}\nArea: {$area}\n\n{$message}\n";
$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Razz website <hello@razzcpl.com>',
    'Reply-To: ' . $email,
]);

$ok = @mail($to, $subject, $body, $headers);
header('Location: contact.html?' . ($ok ? 'sent=1' : 'sent=0') . '#form');
exit;
