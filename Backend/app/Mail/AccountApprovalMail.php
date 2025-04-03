<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $newStatus;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $newStatus)
    {
        $this->user = $user;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match($this->newStatus) {
            'active' => 'Your Account Has Been Approved',
            'suspended' => 'Your Account Has Been Suspended',
            default => 'Your Account Status Has Changed'
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.accountStatusChange',
            with: [
                'user' => $this->user,
                'status' => $this->newStatus
            ]
        );
    }


    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
