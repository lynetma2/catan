package com.sundtrack.catan;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.sundtrack.catan", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

    /** The domain is a plain-Java core: no Spring, no JPA, no adapters, no wiring. */
    @ArchTest
    static final ArchRule domain_is_framework_and_adapter_free =
            noClasses().that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "..application..", "..web..", "..persistence..", "..config..", "..shared.ws..",
                            "org.springframework..", "jakarta.persistence..");

    /** Core domain speaks domain types; only the event/message contracts may carry DTOs. */
    @ArchTest
    static final ArchRule core_domain_does_not_use_dtos =
            noClasses().that().resideInAPackage("..domain..")
                    .and().resideOutsideOfPackage("..domain.event..")
                    .should().dependOnClassesThat().resideInAPackage("..dto..");

    /** Identity stays at the edge — the domain knows player UUIDs, not transport principals. */
    @ArchTest
    static final ArchRule domain_does_not_know_transport_identity =
            noClasses().that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat().haveFullyQualifiedName("java.security.Principal");

    /** The kernel must stay feature-agnostic, or it becomes a dumping ground. */
    @ArchTest
    static final ArchRule shared_kernel_does_not_depend_on_features =
            noClasses().that().resideInAPackage("..shared..")
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "..game..", "..lobby..", "..presence..");

    /** Persistence state documents are a pure storage format, decoupled from the domain. */
    @ArchTest
    static final ArchRule persistence_documents_are_domain_free =
            noClasses().that().resideInAPackage("..persistence.state..")
                    .should().dependOnClassesThat().resideInAPackage("..domain..");

    // ---- Future ratchets (see notes) ----
    // No Jackson in the domain: needs mixins first to preserve the wire format.
    // Application must not reach into adapters: blocked today by the two LobbyStore couplings.
}