angular.module('h15n.en', []).value('$h15n-en', {

    common: {
        error: {
            upload: {
                internal: "There are some errors on our server",
                plugin: "Plugin is failed to upload"
            }
        }
    },

    blacklist: {
        label: {
            number: "Phone Number",
            voice: "Voice",
            sms: "SMS",
            fax: "Fax",
            no_record: "No record found"
        },

        row: {
            delete_uns: {
                title: "Confirmation to delete blacklisted number",
                content: "Do you want to delete number <strong>{{number}}</strong> in blacklist?",
                success: "<strong>{{number}}</strong> is deleted out of your blacklist."
            },

            save: {
                error: {
                    not_found: "You change information of number <strong>{{number}}</strong> is not existed.",
                    invalid: "New number <strong>{{number}}</strong> is unavailabled."
                }
            }
        },

        add: {
            title: "Add Manually",

            message: {
                success: "Phone number <strong>{{number}}</strong> is added successfully.",
                error: "Phone number <strong>{{number}}</strong> is invalid."
            },

            btn: {
                add: "Add Number",
                close: "Close"
            },

            text: {
                number: {
                    empty: "Phone Number will be unsubscribed"
                }
            }
        },

        upload: {
            success: "Your blacklist is uploaded successfully",
            invalid: "Invalid file",
            title: "Permission",
            btn: {
                ok: "OK",
                cancel: "Cancel"
            }
        },

        btn: {
            add: "Add Number",
            manual: "Add Manually"
        },

        text: {
            keyword: {
                empty: "Search with phone number"
            }
        }
    },

    header: {
        name: "Spider Gate",
        menu: {
            compliance: "Compliance Window",
            blacklist: "Blacklist",
            search: "Search",
            user: "User Management",
            settings: "Settings"
        }
    },

    search: {
        label: {
            number: "Phone Number",
            voice: "Voice",
            sms: "SMS",
            fax: "Fax",
            no_record: "No record found"
        },

        text: {
            number: {
                empty: "Phone number need to find information"
            }
        },

        upload: {
            template: "CSV Template",
            confirm: {
                title: "Confirm to upload file",
                content: "Do you want to upload chosen file to our server?"
            },
            success: "Please check your email to download searching result",
            invalid: "You uploaded an invalid file"
        },

        result: {
            title: "Available Actions"
        }
    },

    settings: {
        title: "Agreement Terms",
        btn: {
            save: "Save changes",
            cancel: "Cancel"
        }
    },

    invite: {
        title: {
            invite: "Invite Users",
            pending: "Pending Invitations"
        },
        upload: {
            template: "CSV File Template",
            confirm: {
                title: "Confirm to upload file",
                content: "Do you want to upload chosen file to our server?"
            },
            success: "Invitation emails are sent successfully",
            empty: "No emails"
        },
        btn: {
            invite: "Invite"
        },
        table: {
            header: {
                email: "Email",
                date: "Date Invited",
                invited: "Invited By"
            },
            empty: "No record found"
        },
        resend: {
            title: "Resend invitation",
            content: "Do you want to resend the invitation to <strong>{{email}}</strong>?",
            success: "The invitation has been re-sent successfully.",
            error: {
                not_found: "The invitation has been taken."
            }
        },
        cancel: {
            title: "Cancel invitation",
            content: "Do you want to cancel the invitation to <strong>{{email}}</strong>?",
            success: "The invitation has been cancelled",
            error: {
                not_found: "The invitation hasn't been existed."
            }
        },
        manual: {
            success: "The invitation has been re-sent successfully.",
            missing: "Please enter your Invite Code"
        }
    },

    sidebar: {
        user: "Existing Users",
        invite: "Invite"
    },

    user: {
        manage: {
            info: {
                title: "View member details",
                label: {
                    status: "Status",
                    number: "Phone",
                    role: "Role",
                    email: "Email"
                },
                btn: {
                    close: "Close"
                }
            },

            reinstate: {
                title: "Reinstate User",
                content: "Are you sure to reinstate user <strong>{{fullName}}</strong>?"
            },

            suspend: {
                title: "Suspend User",
                content: "Are you sure to suspend user <strong>{{fullName}}</strong>?"
            },

            deleteUser: {
                title: "Delete User",
                content: "Are you sure to delete user <strong>{{fullName}}</strong>?"
            },

            text: {
                keyword: {
                    empty: "Search users with name, phone number or email"
                }
            },

            table: {
                header: {
                    number: "Phone Number",
                    role: "Role",
                    name: "Name",
                    status: "Status"
                },
                empty: "No record found"
            },

            role: {
                compliance: "Compliance",
                admin: "Admin",
                staff: "Staff"
            }
        }
    }
});